export interface AddSurveyModel{
  question: string
  answers: Array<{
    image: string | null,
    answer: string
  }>
}

export interface AddSurvey{
  add(data : AddSurveyModel):Promise<void>
}
