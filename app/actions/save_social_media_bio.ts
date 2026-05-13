'use server'

import { google } from 'googleapis'

// Saving Social Media Bio Data
export async function saveSocialMediaBio(bio: string, instagramId: string, facebookId: string, twitterId: string, email: string, name: string, researchConsent: string) {
    
    const row = [new Date().toLocaleString(), bio, instagramId, facebookId, twitterId, email, name, researchConsent]    

    try {
        const auth = new google.auth.JWT(
            {
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            }
        );

        const sheets = google.sheets({ version: 'v4', auth })
        // const row = [
        //     new Date().toISOString(),
        //     JSON.stringify(answers),
        // ]

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_SOCIAL_MEDIA_BIO,
            range: "Sheet1!A1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [row]
            }

        });


    } catch (error) {
        console.error('Google Sheets Error:', error);
        return { success: false, error: 'Failed to save data' };

    }
}