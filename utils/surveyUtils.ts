import dropdownData from "@/data/dropdownOptions.json"
export const transformSurveyData = (data: any) => {
    const flatQuestions: any[] = []
    Object.values(data).forEach((section: any) => {
        section.forEach((q: any) => {
            if (q.qtype){
                const transformed: any = {
                    id: q.did,
                    type: q.qtype,
                    section: section,
                    question: q.qtext,
                    jump: q.jump || null,
                    showOnly: q.showOnly || null,
                }

                if (q.qtype === "radio" || q.qtype === "checkbox" || q.qtype === "T5"){
                    transformed.options = q.qoptions
                }

                if (q.qtype === "likert" || q.qtype === "likertTrait"){
                    transformed.labels = {
                        left: q.matches[0] || "1",
                        right: q.matches[1] || "2"
                    };
                }

                if (q.qtype === "dropdown"){
                    const key = q.lookupKey as keyof typeof dropdownData
                    transformed.options = dropdownData[key] || []
                }

                if (q.qtype === "text"){
                    transformed.placeholder = q.placeholder || "Enter Your Response.."
                }

                flatQuestions.push(transformed)
            }

            else if (q.did.includes('CHOOSE')) {
                const transformed: any = {
                    id: q.did,
                    slug: q.qid,
                    type: "choose",
                    section: section,
                    question: q.qtext,
                    options: []
                }

                flatQuestions.push(transformed)
            }
        })
    }) 

    console.log(flatQuestions)
    return flatQuestions;
}
