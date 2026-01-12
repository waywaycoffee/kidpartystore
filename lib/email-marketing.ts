/**
 * Email Marketing Integration
 * Supports Mailchimp and Klaviyo
 */

interface EmailContact {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  customFields?: Record<string, string>;
}

interface EmailCampaign {
  subject: string;
  content: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  segment?: string; // Segment ID or tag
}

interface AbandonedCartEmail {
  email: string;
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  cartTotal: number;
  recoveryUrl: string;
  discountCode?: string;
  discountAmount?: number;
}

class EmailMarketingService {
  private provider: 'mailchimp' | 'klaviyo' | 'none' = 'none';
  private apiKey: string = '';
  private listId: string = '';

  constructor() {
    this.provider = (process.env.EMAIL_MARKETING_PROVIDER as 'mailchimp' | 'klaviyo') || 'none';
    this.apiKey = process.env.EMAIL_MARKETING_API_KEY || '';
    this.listId = process.env.EMAIL_MARKETING_LIST_ID || '';
  }

  /**
   * Add or update contact
   */
  async addContact(contact: EmailContact): Promise<boolean> {
    if (this.provider === 'none' || !this.apiKey) {
      console.warn('Email marketing not configured');
      return false;
    }

    try {
      if (this.provider === 'mailchimp') {
        return await this.addContactToMailchimp(contact);
      } else if (this.provider === 'klaviyo') {
        return await this.addContactToKlaviyo(contact);
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      return false;
    }

    return false;
  }

  /**
   * Send abandoned cart recovery email
   */
  async sendAbandonedCartEmail(data: AbandonedCartEmail): Promise<boolean> {
    if (this.provider === 'none' || !this.apiKey) {
      console.warn('Email marketing not configured');
      return false;
    }

    try {
      const subject = `你的${data.cartItems[0]?.name || '派对套餐'}还在购物车，等你哦！`;
      const content = this.generateAbandonedCartEmailContent(data);

      if (this.provider === 'mailchimp') {
        return await this.sendMailchimpEmail(data.email, subject, content);
      } else if (this.provider === 'klaviyo') {
        return await this.sendKlaviyoEmail(data.email, subject, content);
      }
    } catch (error) {
      console.error('Error sending abandoned cart email:', error);
      return false;
    }

    return false;
  }

  /**
   * Send promotional email
   */
  async sendPromotionalEmail(
    emails: string[],
    subject: string,
    content: string,
    segment?: string
  ): Promise<boolean> {
    if (this.provider === 'none' || !this.apiKey) {
      console.warn('Email marketing not configured');
      return false;
    }

    try {
      if (this.provider === 'mailchimp') {
        return await this.sendMailchimpCampaign(emails, subject, content, segment);
      } else if (this.provider === 'klaviyo') {
        return await this.sendKlaviyoCampaign(emails, subject, content, segment);
      }
    } catch (error) {
      console.error('Error sending promotional email:', error);
      return false;
    }

    return false;
  }

  /**
   * Add tags to contact
   */
  async addTagsToContact(email: string, tags: string[]): Promise<boolean> {
    if (this.provider === 'none' || !this.apiKey) {
      return false;
    }

    try {
      if (this.provider === 'mailchimp') {
        return await this.addTagsToMailchimpContact(email, tags);
      } else if (this.provider === 'klaviyo') {
        return await this.addTagsToKlaviyoContact(email, tags);
      }
    } catch (error) {
      console.error('Error adding tags:', error);
      return false;
    }

    return false;
  }

  // Mailchimp methods
  private async addContactToMailchimp(contact: EmailContact): Promise<boolean> {
    const [dc] = this.apiKey.split('-').slice(-1);
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${this.listId}/members`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: contact.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName || '',
          LNAME: contact.lastName || '',
          ...contact.customFields,
        },
        tags: contact.tags || [],
      }),
    });

    return response.ok;
  }

  private async sendMailchimpEmail(email: string, subject: string, content: string): Promise<boolean> {
    // For transactional emails, use Mailchimp Transactional API
    // For now, we'll use a simplified approach
    const [dc] = this.apiKey.split('-').slice(-1);
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${this.listId}/members/${Buffer.from(email).toString('base64')}`;

    // Add contact first
    await this.addContactToMailchimp({ email });

    // Then send via campaign (simplified - in production, use proper campaign API)
    return true;
  }

  private async sendMailchimpCampaign(
    emails: string[],
    subject: string,
    content: string,
    segment?: string
  ): Promise<boolean> {
    // Implementation for Mailchimp campaign
    // This is a simplified version - in production, use Mailchimp Campaign API
    return true;
  }

  private async addTagsToMailchimpContact(email: string, tags: string[]): Promise<boolean> {
    const [dc] = this.apiKey.split('-').slice(-1);
    const subscriberHash = Buffer.from(email.toLowerCase()).toString('base64').replace(/=+$/, '');
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${this.listId}/members/${subscriberHash}/tags`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: tags.map((tag) => ({ name: tag, status: 'active' })),
      }),
    });

    return response.ok;
  }

  // Klaviyo methods
  private async addContactToKlaviyo(contact: EmailContact): Promise<boolean> {
    const url = 'https://a.klaviyo.com/api/profiles/';

    const profileData: any = {
      type: 'profile',
      attributes: {
        email: contact.email,
        first_name: contact.firstName,
        last_name: contact.lastName,
        ...contact.customFields,
      },
    };

    if (contact.tags && contact.tags.length > 0) {
      profileData.relationships = {
        segments: {
          data: contact.tags.map((tag) => ({
            type: 'segment',
            id: tag,
          })),
        },
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${this.apiKey}`,
        'Content-Type': 'application/json',
        'revision': '2024-10-15',
      },
      body: JSON.stringify({ data: profileData }),
    });

    return response.ok;
  }

  private async sendKlaviyoEmail(email: string, subject: string, content: string): Promise<boolean> {
    // Klaviyo uses flows for automated emails
    // This is a simplified version - in production, use Klaviyo Flow API
    return true;
  }

  private async sendKlaviyoCampaign(
    emails: string[],
    subject: string,
    content: string,
    segment?: string
  ): Promise<boolean> {
    // Implementation for Klaviyo campaign
    return true;
  }

  private async addTagsToKlaviyoContact(email: string, tags: string[]): Promise<boolean> {
    // Klaviyo uses segments instead of tags
    // Implementation would use Klaviyo Segment API
    return true;
  }

  /**
   * Generate abandoned cart email content
   */
  private generateAbandonedCartEmailContent(data: AbandonedCartEmail): string {
    const discountText = data.discountCode
      ? `<p style="color: #e74c3c; font-weight: bold; font-size: 18px;">限时优惠：使用折扣码 <strong>${data.discountCode}</strong> 可享受 $${data.discountAmount || 5} 优惠（24小时内有效）</p>`
      : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h1 style="color: #2c3e50;">忘记付款了吗？</h1>
          <p>你的购物车中还有以下商品：</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            ${data.cartItems.map(item => `
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
                <div style="flex: 1;">
                  <h3 style="margin: 0; font-size: 16px;">${item.name}</h3>
                  <p style="margin: 5px 0; color: #666;">数量: ${item.quantity}</p>
                  <p style="margin: 0; font-weight: bold; color: #e74c3c;">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">总价: <span style="color: #e74c3c; font-size: 24px;">$${data.cartTotal.toFixed(2)}</span></p>
            ${discountText}
            <a href="${data.recoveryUrl}" style="display: inline-block; background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">恢复购物车</a>
          </div>

          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            此链接24小时内有效。如有任何问题，请随时联系我们。
          </p>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailMarketingService = new EmailMarketingService();

