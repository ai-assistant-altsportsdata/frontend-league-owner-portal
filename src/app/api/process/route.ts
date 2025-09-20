import { NextRequest, NextResponse } from 'next/server';

// Mock data processing function
async function processFileData(fileContent: string, fileName: string) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  let data: any[] = [];
  let schema: any = {};

  try {
    // Parse based on file type
    if (fileName.endsWith('.json')) {
      const parsed = JSON.parse(fileContent);
      data = Array.isArray(parsed) ? parsed : [parsed];
    } else if (fileName.endsWith('.csv')) {
      // Simple CSV parser
      const lines = fileContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
      data = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
        if (values.length === headers.length) {
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          data.push(row);
        }
      }
    }

    // Generate schema from data
    if (data.length > 0) {
      const sampleRecord = data[0];
      const properties: any = {};

      Object.keys(sampleRecord).forEach((key) => {
        const values = data.map(record => record[key]).filter(v => v != null);
        const inferredType = inferDataType(values[0]);

        properties[key] = {
          type: inferredType,
          example: values[0],
          description: `Field: ${key}`,
        };
      });

      schema = {
        type: 'array',
        items: {
          type: 'object',
          properties,
          required: Object.keys(properties),
        },
      };
    }

    return {
      success: true,
      data,
      schema,
      preview: data.slice(0, 5),
      recordCount: data.length,
      fieldCount: Object.keys(schema.items?.properties || {}).length,
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to process file: ${error}`,
    };
  }
}

function inferDataType(value: any): string {
  if (value === null || value === undefined || value === '') return 'string';
  if (typeof value === 'boolean') return 'boolean';
  if (!isNaN(Number(value)) && !isNaN(parseFloat(value))) return 'number';
  if (typeof value === 'string') {
    // Check for date patterns
    if (value.match(/^\d{4}-\d{2}-\d{2}/) || value.match(/^\d{2}\/\d{2}\/\d{4}/)) {
      return 'date';
    }
    // Check for email pattern
    if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return 'email';
    }
    // Check for URL pattern
    if (value.match(/^https?:\/\//)) {
      return 'url';
    }
    return 'string';
  }
  return 'string';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileContent, fileName, fileId } = body;

    if (!fileContent || !fileName) {
      return NextResponse.json(
        { success: false, error: 'File content and name are required' },
        { status: 400 }
      );
    }

    const result = await processFileData(fileContent, fileName);

    return NextResponse.json({
      fileId,
      fileName,
      ...result,
    });

  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during processing' },
      { status: 500 }
    );
  }
}