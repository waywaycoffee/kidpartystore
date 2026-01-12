/**
 * Forms API - List and Create
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FORMS_FILE = path.join(DATA_DIR, 'forms.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface Form {
  id: string;
  name: string;
  description?: string;
  fields: any[];
  settings: any;
  createdAt: string;
  updatedAt: string;
  submissionCount: number;
}

async function getForms(): Promise<Form[]> {
  try {
    await ensureDataDir();
    await fs.access(FORMS_FILE);
    const data = await fs.readFile(FORMS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveForms(forms: Form[]) {
  await ensureDataDir();
  await fs.writeFile(FORMS_FILE, JSON.stringify(forms, null, 2));
}

export async function GET() {
  try {
    const forms = await getForms();
    return NextResponse.json({ forms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, fields, settings } = body;

    if (!name || !fields || !Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const forms = await getForms();
    const newForm: Form = {
      id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      fields,
      settings: settings || {
        saveToDatabase: true,
        successMessage: 'Thank you for your submission!',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissionCount: 0,
    };

    forms.push(newForm);
    await saveForms(forms);

    return NextResponse.json({ form: newForm });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

