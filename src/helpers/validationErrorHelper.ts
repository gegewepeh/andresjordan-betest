function validationErrorHelper (error: any) {
  let finalErrorList: object[] = []
  // schema rule violation parser
  const schemaRulesError = error.errInfo.details.schemaRulesNotSatisfied
  schemaRulesError.forEach((schemaRule: any) => {
    switch (schemaRule.operatorName) {
      case 'required':
        schemaRule.missingProperties.forEach((missed: any) => {
          finalErrorList.push({
            field: missed,
            expected: `${missed} is required`
          })
        })
        break
      case 'properties':
        let validationErrorsArray = schemaRule.propertiesNotSatisfied

        validationErrorsArray.forEach((name: any) => {
          let operatorName: string = name.details[0].operatorName
          let specifiedAs: string = name.details[0].specifiedAs[operatorName]
          finalErrorList.push({
            field: name.propertyName,
            expected: specifiedAsHelper(operatorName, specifiedAs)
          })
        })
      default:
        break
    }
  })

  return {
    httpStatus: 400,
    message: 'Error Validation',
    details: finalErrorList
  }
}
 
function specifiedAsHelper(operatorName: string, specifiedAs: string) {
  switch (operatorName) {
    case 'bsonType': 
      switch (specifiedAs) {
        case 'int':
          return 'type must be number'
        case 'string':
          return 'type must be string'
        default:
          return 'unhandled-type'
      }
    case 'pattern':
      switch (specifiedAs) {
        case "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?":
          return 'must be in email format'
        default:
          return 'unhandled-pattern'
      }
    default:
      return 'unhandled-operator-name'
  }
}

export default validationErrorHelper

