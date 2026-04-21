'use server'

import { google } from 'googleapis'


// Save Word Personality Query
export async function saveWordPersonalityQuery(word_string: string, selectedCategories: string[]) {
    const selectedCategoriesString = selectedCategories.join()
    const row = [new Date().toLocaleString(), word_string, selectedCategoriesString]    

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
            spreadsheetId: process.env.GOOGLE_SHEET_WORD_PERSONALITY,
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