<script lang="ts">
import { fieldTypes, createRequestObjectAndResetErrors, setErrorResponses } from './functions/authFunctions';
import axios from 'axios';
export let baseUrl:string = 'valueInChild'
export let authenticated:boolean = false

//console.log('Base URL:', baseUrl)


let disabled:boolean = true;
let buttonText:string = "Sign up";
let nonFieldError = "";


let registerFields: fieldTypes[] = [
    {
      label: "Name",
      value: "",
      name: "name",
      type: "text",
      placeholder: "Enter your name",
      hasError: false,
      errorText: ""
   },
   {
      label: "Email address",
      value: "",
      name: "email",
      type: "text",
      placeholder: "Enter your email address",
      hasError: false,
      errorText: ""
   },
   {
      label: "Password",
      value: "",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      hasError: false,
      errorText: ""
   }
]

const attemptRegister = () : void => {
   // console.log('Fields:', registerFields)

    let requestItems =  createRequestObjectAndResetErrors(registerFields);
    let requestObject = requestItems.requestObject;
    registerFields = requestItems.fields;

    buttonText = "Creating your account..."
    nonFieldError = ""

    axios.post(`${baseUrl}/register/`, requestObject).then(response => {
        buttonText = "Sign up";
       // console.log('User response:', response);
        localStorage.setItem('userToken', response.data.token)
        authenticated = true
    }).catch(error => {
        buttonText = "Sign up"
        let errorResponse = error.response.data;
      //  console.log('Request error:', errorResponse)

        if (errorResponse.non_field_errors || errorResponse.msg) {
            nonFieldError = errorResponse.non_field_errors ? errorResponse.non_field_errors[0] : errorResponse.msg

            setTimeout(() => {
                nonFieldError = ""
            }, 6000)
        } else {
            registerFields = setErrorResponses(errorResponse, registerFields)
        }
      
    })
}

const getFieldValue = (event: Event, index: number) : void => {
    let fieldValue = (event.target as HTMLInputElement).value;
    registerFields[index].value = fieldValue;
    registerFields[index].hasError = fieldValue === '';

    disabled = registerFields.filter(field => field.value === '').length > 0
}


</script>

<main>
    <div class="auth-modal">
        <div class="header">Create an account</div>
      {#each registerFields as field, index}
        <div class="auth-group">
            <label for="input-field-{index}">{ field.label }</label>
            <input class="{field.hasError ? 'input-error': ''}" on:input={event => getFieldValue(event, index)} name="{ field.name }" type="{field.type}" value="{ field.value }" placeholder="{ field.placeholder }" id="input-field-{index}">
            <span class="error-text">{ field.errorText }</span>
        </div>
      {/each}

      {#if nonFieldError != ""}
            <div class="non-field-error">{ nonFieldError }</div>
      {/if}
    
      <div class="button-container">
        <button disabled={disabled} on:click={() => attemptRegister()}>{ buttonText }</button>
      </div>
    </div>
</main>

<style lang="scss">
    @import "./css/auth.scss";
 </style>