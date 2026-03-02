'use server'

import { google } from 'googleapis'

export async function saveToGoogleSheets(answersStr: any, user_email: any) {
    const answers = JSON.parse(answersStr);
    const headers = ['Timestamp',
        'Age',
        'Gender',
        'Nationality',
        'ETH1',
        'ETHCHOOSE',
        'ethMainChoice',
        'SOR2',
        'SORCHOOSE',
        'sorMainChoice',
        'FAM2',
        'FAMCHOOSE',
        'famMainChoice',
        'OCC2',
        'OCC3',
        'OCC4',
        'OCCCHOOSE',
        'occMainChoice',
        'SER1',
        'SER2',
        'SERCHOOSE',
        'serMainChoice',
        'ED2',
        'ED3',
        'EDUCHOOSE',
        'eduMainChoice',
        'ERS1',
        'ERS2Choice',
        'ERS3Choice',
        'ERS4Choice',
        'ERSCHOOSE',
        'ersMainChoice',
        'AA1',
        'AA2Choice',
        'AACHOOSE',
        'aaMainChoice',
        'PER1Choice',
        'PER2Choice',
        'PER3Choice',
        'PER4Choice',
        'PER5Choice',
        'PERCHOOSE',
        'perMainChoice',
        'LIF1Choice',
        'LIF2Choice',
        'LIF3Choice',
        'LIF4',
        'LIFCHOOSE',
        'lifMainChoice',
        'SEP1Choice',
        'SEP2Choice',
        'SEPCHOOSE',
        'sepMainChoice',
        'HEL1',
        'HEL2',
        'HEL3',
        'HEL4',
        'HELCHOOSE',
        'helMainChoice',
        'LOC1',
        'LOC6',
        'LOC12',
        'LOC7',
        'LOC8',
        'LOC13',
        'LOC14',
        'LOC2',
        'LOC9',
        'LOC10',
        'LOC11',
        'LOC3Choice',
        'LOC4Choice',
        'LOC5Choice',
        'LOCCHOOSE',
        'locMainChoice',
        'SPO2Choice',
        'SPO3Choice',
        'SPO4',
        'SPO5',
        'SPO6',
        'SPOCHOOSE',
        'spoMainChoice',
        'REL2',
        'RELCHOOSE',
        'relMainChoice',
        'POL2',
        'POL3',
        'POLCHOOSE',
        'polMainChoice',
        'HOB1Choice',
        'HOB2Choice',
        'HOB3Choice',
        'HOB4Choice',
        'HOB5Choice',
        'HOBCHOOSE',
        'hobMainChoice',
        'GEN1',
        'GENCHOOSE',
        'genMainChoice',
        'ENT1',
        'ENT2',
        'ENT3',
        'ENT4',
        'ENT5',
        'ENT6',
        'ENTCHOOSE',
        'entMainChoice',
        'SM2',
        'SMCHOOSE',
        'socMainChoice',
        'T5',
        'finalRankedChoices',
        'Email',
    'surveyType']


    const row: any[] = []

    headers.forEach((h) => {
        if (h === 'Email') {
            if (user_email) {
                row.push(user_email)
            } else {
                row.push("")
            }
        } else if (h === 'Timestamp') {
            row.push(new Date().toLocaleString())
        } else {
            let value = answers[h];
            if (Array.isArray(value)) {
                value = value.join('|');
            }
            row.push(value || "");
        }
    }
    )

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
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "Sheet1!A1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [row]
            }

        });


        // const response = await fetch('http://localhost:8000/analyze', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(answers),
        // });

        // if (!response.ok) throw new Error('Analysis failed');

        // const analysisData = await response.json();

        // return { success: true, data: analysisData }


    } catch (error) {
        console.error('Google Sheets Error:', error);
        return { success: false, error: 'Failed to save data' };

    }
}