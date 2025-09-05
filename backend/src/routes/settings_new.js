const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all settings
router.get('/', async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      throw error;
    }

    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings
router.post('/', async (req, res) => {
  try {
    const { settings } = req.body;

    // Process each setting
    for (const [key, value] of Object.entries(settings)) {
      // Check if setting exists
      const { data: existingSetting } = await supabase
        .from('settings')
        .select('*')
        .eq('key', key)
        .single();

      if (existingSetting) {
        // Update existing setting
        const { error: updateError } = await supabase
          .from('settings')
          .update({ value })
          .eq('key', key);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new setting
        const { error: insertError } = await supabase
          .from('settings')
          .insert([{ key, value }]);

        if (insertError) {
          throw insertError;
        }
      }
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;