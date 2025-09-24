import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-cc8d3455/health", (c) => {
  return c.json({ status: "ok" });
});

// Stripe payment endpoint
app.post("/make-server-cc8d3455/create-payment-intent", async (c) => {
  try {
    const body = await c.req.json();
    const { amount, currency = 'usd', giftData } = body;

    console.log('Creating payment intent for amount:', amount, 'currency:', currency, 'giftData:', giftData);

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.log('Invalid amount:', amount, 'type:', typeof amount);
      return c.json({ error: 'Invalid payment amount. Amount must be a positive number.' }, 400);
    }

    // Validate amount is reasonable (between $1 and $1000)
    if (amount < 1 || amount > 1000) {
      console.log('Amount out of range:', amount);
      return c.json({ error: 'Payment amount must be between $1 and $1000' }, 400);
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey || stripeSecretKey.length < 10) {
      console.log('Stripe secret key not found or invalid, using demo mode');
      console.log('Available env vars:', Object.keys(Deno.env.toObject()));
      
      // Demo mode - simulate payment intent creation
      const demoPaymentIntentId = `pi_demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Store gift data temporarily with demo payment intent ID
      try {
        await kv.set(`payment_${demoPaymentIntentId}`, JSON.stringify({
          giftData,
          amount,
          currency,
          created_at: new Date().toISOString(),
          demo_mode: true,
        }));
        console.log('Demo payment data stored successfully');
      } catch (storageError) {
        console.error('Error storing demo payment data:', storageError);
        return c.json({ error: 'Failed to initialize payment. Please try again.' }, 500);
      }

      return c.json({
        clientSecret: `${demoPaymentIntentId}_secret_demo`,
        paymentIntentId: demoPaymentIntentId,
        demo_mode: true,
        message: 'Running in demo mode. No real payment will be processed.'
      });
    }

    console.log('Stripe key found, creating real payment intent...');

    // Create payment intent with Stripe API
    const paymentIntentPayload = new URLSearchParams();
    paymentIntentPayload.append('amount', Math.round(amount * 100).toString()); // Convert to cents and ensure integer
    paymentIntentPayload.append('currency', currency.toLowerCase());
    paymentIntentPayload.append('automatic_payment_methods[enabled]', 'true');
    paymentIntentPayload.append('description', `FloroDay Digital Flower Gift - ${giftData?.plan || '30'} days`);

    // Add metadata if giftData exists
    if (giftData) {
      if (giftData.recipientName) paymentIntentPayload.append('metadata[gift_recipient]', giftData.recipientName);
      if (giftData.senderName) paymentIntentPayload.append('metadata[gift_sender]', giftData.senderName);
      if (giftData.plan) paymentIntentPayload.append('metadata[gift_duration]', giftData.plan);
      if (giftData.flower?.name) paymentIntentPayload.append('metadata[flower_name]', giftData.flower.name);
    }

    console.log('Sending request to Stripe API with payload:', paymentIntentPayload.toString());

    const paymentIntent = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: paymentIntentPayload.toString(),
    });

    console.log('Stripe API response status:', paymentIntent.status);

    if (!paymentIntent.ok) {
      const errorText = await paymentIntent.text();
      console.error('Stripe API error response:', errorText);
      console.error('Stripe API response headers:', Object.fromEntries(paymentIntent.headers.entries()));
      
      let errorMessage = 'Failed to create payment intent';
      let errorCode = 'stripe_error';
      
      try {
        const errorData = JSON.parse(errorText);
        console.error('Parsed Stripe error:', errorData);
        errorMessage = errorData.error?.message || errorMessage;
        errorCode = errorData.error?.code || errorCode;
      } catch (e) {
        console.error('Could not parse Stripe error response as JSON:', e);
        errorMessage = errorText || errorMessage;
      }
      
      return c.json({ 
        error: errorMessage, 
        error_code: errorCode,
        stripe_response: errorText 
      }, 400);
    }

    const paymentData = await paymentIntent.json();
    console.log('Payment intent created successfully:', paymentData.id);
    console.log('Payment intent data:', JSON.stringify(paymentData, null, 2));
    
    // Store gift data temporarily with payment intent ID
    await kv.set(`payment_${paymentData.id}`, JSON.stringify({
      giftData,
      amount,
      currency,
      created_at: new Date().toISOString(),
    }));

    return c.json({
      clientSecret: paymentData.client_secret,
      paymentIntentId: paymentData.id,
    });

  } catch (error) {
    console.log('Payment intent creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return c.json({ error: `Internal server error: ${errorMessage}` }, 500);
  }
});

// Confirm payment and create gift
app.post("/make-server-cc8d3455/confirm-payment", async (c) => {
  try {
    const body = await c.req.json();
    const { paymentIntentId } = body;

    console.log('Confirming payment for intent:', paymentIntentId);

    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      console.error('Invalid payment intent ID:', paymentIntentId);
      return c.json({ error: 'Valid payment intent ID required' }, 400);
    }

    // Retrieve stored gift data
    const storedData = await kv.get(`payment_${paymentIntentId}`);
    if (!storedData) {
      console.error('Payment data not found for intent:', paymentIntentId);
      // List all keys for debugging
      const allKeys = await kv.getByPrefix('payment_');
      console.log('Available payment keys:', allKeys.map(item => item.key));
      return c.json({ error: 'Payment data not found. Payment may have expired or already been processed.' }, 404);
    }

    let paymentData;
    try {
      paymentData = JSON.parse(storedData);
      console.log('Retrieved payment data:', JSON.stringify(paymentData, null, 2));
    } catch (parseError) {
      console.error('Error parsing payment data:', parseError);
      return c.json({ error: 'Invalid payment data format' }, 500);
    }
    
    // Generate unique gift ID
    const giftId = `floro_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Validate giftData structure
    if (!paymentData.giftData) {
      console.error('Missing giftData in payment data');
      return c.json({ error: 'Invalid payment data: missing gift information' }, 400);
    }

    // Store gift information
    const giftInfo = {
      id: giftId,
      ...paymentData.giftData,
      plan: paymentData.giftData.plan || '30',
      paymentIntentId,
      status: 'active',
      created_at: new Date().toISOString(),
      start_date: new Date().toISOString().split('T')[0],
      demo_mode: paymentData.demo_mode || false,
      currentDay: 1, // Initialize current day
      // Store both recipient and sender emails for user association
      senderEmail: paymentData.giftData.recipientEmail, // The person who bought it
      created_by_email: paymentData.giftData.recipientEmail,
    };

    console.log('Creating gift with info:', JSON.stringify(giftInfo, null, 2));
    
    try {
      await kv.set(`gift_${giftId}`, JSON.stringify(giftInfo));
      console.log('Gift stored successfully in database');
    } catch (storageError) {
      console.error('Error storing gift in database:', storageError);
      return c.json({ error: 'Failed to create gift. Please try again.' }, 500);
    }
    
    // Clean up temporary payment data
    try {
      await kv.del(`payment_${paymentIntentId}`);
      console.log('Payment data cleaned up');
    } catch (cleanupError) {
      console.error('Error cleaning up payment data:', cleanupError);
      // This is not critical, continue anyway
    }

    console.log('Gift created successfully:', giftId);

    return c.json({
      success: true,
      giftId,
      giftInfo,
    });

  } catch (error) {
    console.log('Payment confirmation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return c.json({ error: `Internal server error: ${errorMessage}` }, 500);
  }
});

// Get gift information
app.get("/make-server-cc8d3455/gift/:giftId", async (c) => {
  try {
    const giftId = c.req.param('giftId');
    console.log('Fetching gift with ID:', giftId);
    
    const giftData = await kv.get(`gift_${giftId}`);
    
    if (!giftData) {
      console.log('Gift not found for ID:', giftId);
      
      // List all available gift keys for debugging
      const allGiftKeys = await kv.getByPrefix('gift_');
      console.log('Available gift keys:', allGiftKeys.map(item => item.key));
      
      return c.json({ 
        error: 'Gift not found', 
        giftId,
        debug: {
          searchKey: `gift_${giftId}`,
          availableKeys: allGiftKeys.map(item => item.key)
        }
      }, 404);
    }

    let gift;
    try {
      gift = JSON.parse(giftData);
      console.log('Successfully parsed gift data for:', giftId);
    } catch (parseError) {
      console.error('Error parsing gift data:', parseError);
      return c.json({ error: 'Invalid gift data format' }, 500);
    }
    
    // Calculate current day
    const startDate = new Date(gift.start_date);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const currentDay = Math.max(1, Math.min(daysDiff, parseInt(gift.plan || '30')));

    console.log('Gift retrieved successfully:', giftId, 'currentDay:', currentDay);

    return c.json({
      ...gift,
      currentDay,
    });

  } catch (error) {
    console.error('Gift retrieval error:', error);
    return c.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Send magic link for authentication
app.post("/make-server-cc8d3455/send-magic-link", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    console.log('Sending magic link to:', email);

    if (!email || !email.includes('@')) {
      return c.json({ error: 'Valid email address required' }, 400);
    }

    // Check if user already exists first
    let userExists = false;
    
    try {
      // Try to create user account if it doesn't exist
      const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true, // Auto-confirm since we don't have email server configured
      });

      if (error) {
        // Check for various forms of "user already exists" errors
        if (error.message.includes('already been registered') || 
            error.message.includes('User already registered') ||
            error.code === 'email_exists' ||
            error.status === 422) {
          console.log('User already exists:', email);
          userExists = true;
        } else {
          console.error('Error creating user:', error);
          return c.json({ error: 'Failed to send magic link' }, 500);
        }
      } else {
        console.log('New user created:', email);
      }
    } catch (createError) {
      console.error('Exception during user creation:', createError);
      return c.json({ error: 'Failed to send magic link' }, 500);
    }

    console.log('Magic link sent successfully to:', email);

    return c.json({
      success: true,
      message: 'Magic link sent to your email',
    });

  } catch (error) {
    console.error('Magic link error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user gifts
app.get("/make-server-cc8d3455/user-gifts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    // Verify user
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.error('Auth error:', error);
      return c.json({ error: 'Invalid authorization' }, 401);
    }

    console.log('Fetching gifts for user:', user.email);

    // Get all gifts for this user by email
    const allGifts = await kv.getByPrefix('gift_');
    const userGifts = allGifts
      .map(item => {
        try {
          const gift = JSON.parse(item.value);
          return gift;
        } catch (e) {
          return null;
        }
      })
      .filter(gift => gift && (
        gift.recipientEmail === user.email ||
        gift.senderEmail === user.email ||
        // For backward compatibility, also check if the user created this gift
        (gift.created_by_email && gift.created_by_email === user.email)
      ));

    console.log(`Found ${userGifts.length} gifts for user:`, user.email);

    return c.json({
      gifts: userGifts,
      user: {
        id: user.id,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('User gifts error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Store user email with gift (for attribution)
app.post("/make-server-cc8d3455/associate-gift-with-user", async (c) => {
  try {
    const body = await c.req.json();
    const { email, giftId } = body;

    console.log('Associating gift', giftId, 'with user:', email);

    if (!email || !giftId) {
      return c.json({ error: 'Email and gift ID required' }, 400);
    }

    // Get existing gift data
    const giftData = await kv.get(`gift_${giftId}`);
    if (!giftData) {
      return c.json({ error: 'Gift not found' }, 404);
    }

    // Parse and update gift data
    const gift = JSON.parse(giftData);
    gift.created_by_email = email;
    gift.updated_at = new Date().toISOString();

    // Save updated gift
    await kv.set(`gift_${giftId}`, JSON.stringify(gift));

    console.log('Gift associated with user successfully');

    return c.json({
      success: true,
      message: 'Gift associated with user account'
    });

  } catch (error) {
    console.error('Gift association error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);