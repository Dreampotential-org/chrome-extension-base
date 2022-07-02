export interface fieldTypes {
    label: string,
    value: string,
    name: string
    type: string,
    placeholder: string,
    hasError: boolean,
    errorText: string
  }

export const setErrorResponses = (errors: object, fields: fieldTypes[]): fieldTypes[] => {
    for (const key in errors) {
        let matchingField = fields.find(field => field.name === key);
        if (matchingField) {
            let index = fields.indexOf(matchingField);

            if (index !== -1) {
                fields[index].hasError = true;
                fields[index].errorText = errors[key][0];
            }
        }
    }

    return fields
}

interface requestReturnType {
    requestObject: object,
    fields: fieldTypes[]
}
export const createRequestObjectAndResetErrors = (fields: fieldTypes[]) : requestReturnType => {
    let requestObject = {};

   fields = fields.map(field => {
        requestObject[field.name] = field.value
        field.hasError = false
        field.errorText = ""

        return field
    })

    return { requestObject, fields }
}