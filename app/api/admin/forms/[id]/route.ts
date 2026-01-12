/**
 * Form API - Get, Update, Delete
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const forms = await getForms();
    const form = forms.find((f) => f.id === params.id);

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ form });
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const forms = await getForms();
    const index = forms.findIndex((f) => f.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    forms[index] = {
      ...forms[index],
      ...body,
      id: params.id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    await saveForms(forms);
    return NextResponse.json({ form: forms[index] });
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const forms = await getForms();
    const filtered = forms.filter((f) => f.id !== params.id);

    if (forms.length === filtered.length) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    await saveForms(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

