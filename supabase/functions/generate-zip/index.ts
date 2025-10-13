import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, filename = "generated-code" } = await req.json();
    
    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating ZIP file:', filename);

    // Create ZIP file
    const zip = new JSZip();
    
    // Add code file to ZIP
    zip.addFile(`${filename}.js`, code);
    
    // Add README
    const readme = `# Generated Code
    
This code was generated using CodeGen AI.

## Usage
1. Install dependencies if needed
2. Import the code into your project
3. Follow the comments in the code for implementation details

Generated on: ${new Date().toISOString()}
`;
    
    zip.addFile('README.md', readme);

    // Generate ZIP as base64
    const zipBlob = await zip.generateAsync({ type: "base64" });

    console.log('ZIP created successfully');
    return new Response(
      JSON.stringify({ zipBase64: zipBlob }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-zip function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create ZIP' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});