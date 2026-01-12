/**
 * Form Submission API
 * 处理表单提交
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FORMS_FILE = path.join(DATA_DIR, 'forms.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'form-submissions.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function getForms() {
  try {
    await ensureDataDir();
    await fs.access(FORMS_FILE);
    const data = await fs.readFile(FORMS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function getSubmissions() {
  try {
    await ensureDataDir();
    await fs.access(SUBMISSIONS_FILE);
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubmissions(submissions: any[]) {
  await ensureDataDir();
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

async function saveForms(forms: any[]) {
  await ensureDataDir();
  await fs.writeFile(FORMS_FILE, JSON.stringify(forms, null, 2));
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const formData = body.data;

    // Get form
    const forms = await getForms();
    const form = forms.find((f) => f.id === params.id);

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Validate required fields
    for (const field of form.fields) {
      if (field.required && !formData[field.name]) {
        return NextResponse.json(
          { error: `${field.label} is required` },
          { status: 400 }
        );
      }

      // Validate field types and patterns
      if (formData[field.name]) {
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.name])) {
          return NextResponse.json(
            { error: `Invalid email format for ${field.label}` },
            { status: 400 }
          );
        }

        if (field.validation) {
          if (field.validation.minLength && formData[field.name].length < field.validation.minLength) {
            return NextResponse.json(
              { error: `${field.label} must be at least ${field.validation.minLength} characters` },
              { status: 400 }
            );
          }
          if (field.validation.maxLength && formData[field.name].length > field.validation.maxLength) {
            return NextResponse.json(
              { error: `${field.label} must be at most ${field.validation.maxLength} characters` },
              { status: 400 }
            );
          }
          if (field.validation.pattern && !new RegExp(field.validation.pattern).test(formData[field.name])) {
            return NextResponse.json(
              { error: `${field.label} format is invalid` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Save submission
    const submissions = await getSubmissions();
    const submission = {
      id: `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      formId: params.id,
      formName: form.name,
      data: formData,
      submittedAt: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    };

    submissions.push(submission);
    await saveSubmissions(submissions);

    // Update form submission count
    const formIndex = forms.findIndex((f) => f.id === params.id);
    if (formIndex >= 0) {
      forms[formIndex].submissionCount = (forms[formIndex].submissionCount || 0) + 1;
      forms[formIndex].updatedAt = new Date().toISOString();
      await saveForms(forms);
    }

    // Send email notification if configured
    if (form.settings?.emailNotification) {
      try {
        const { sendEmail } = await import('@/lib/email');
        const emailBody = Object.entries(formData)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
          .join('<br>');

        await sendEmail({
          to: form.settings.emailNotification,
          subject: `New Form Submission: ${form.name}`,
          html: `
            <h2>New Form Submission</h2>
            <p><strong>Form:</strong> ${form.name}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            ${emailBody}
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the submission if email fails
      }
    }

    // Call webhook if configured
    if (form.settings?.webhookUrl) {
      try {
        const response = await fetch(form.settings.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission),
        });
        if (!response.ok) {
          console.error('Webhook call failed:', response.statusText);
        }
      } catch (webhookError) {
        console.error('Failed to call webhook:', webhookError);
        // Don't fail the submission if webhook fails
      }
    }

    return NextResponse.json({
      success: true,
      message: form.settings?.successMessage || 'Thank you for your submission!',
      redirectUrl: form.settings?.redirectUrl,
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

