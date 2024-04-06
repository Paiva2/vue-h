const dateFormatter = (date: Date) => new Intl.DateTimeFormat('en-US',{
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
}).format(date)

export default dateFormatter
