export interface AddSurveyModel{
  question: string
  answers: Array<{
    image?: string,
    answer: string,
  }>
  date: Date,
}

export interface AddSurvey{
  add(data : AddSurveyModel):Promise<void>
}
