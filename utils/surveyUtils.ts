
export const transformSurveyData = (data: any) => {
    const flatQuestions: any[] = []
    Object.values(data).forEach((section: any) => {
        section.forEach((q: any) => {
            if (q.qtype){
                const transformed: any = {
                    id: q.did,
                    slug: q.qid,
                    type: q.qtype,
                    question: q.qtext
                }

                if (q.qtype == "radio" || q.qtype == "checkbox"){
                    transformed.options = q.qoptions
                }

                if (q.qtype == "likert"){
                    transformed.labels = {
                        left: q.matches[0] || "1",
                        right: q.matches[1] || "2"
                    };
                }

                flatQuestions.push(transformed)
            }
        })
    }) 

    console.log(flatQuestions)
    return flatQuestions;
}
