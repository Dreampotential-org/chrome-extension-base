<script lang="ts">
import { fieldTypes, createRequestObjectAndResetErrors, setErrorResponses } from './functions/authFunctions';
import axios from 'axios';
export let baseUrl:string = 'valueInChild'
export let authenticated:boolean = false;
export let currentScreen:string = '';

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

const switchScreen = () : void => {
    currentScreen = 'login'
}

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
        <div class="modal-header">
            <button class="switch-screen" on:click={() => switchScreen()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                    <path d="M447.1 256C447.1 273.7 433.7 288 416 288H109.3l105.4 105.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H416C433.7 224 447.1 238.3 447.1 256z"/>
                </svg>
            </button>
            <div class="header">Create an account</div>
        </div>
       
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

    .switch-screen{
        background: transparent;
        border: 1px solid transparent;
        font-size: 13px;
        padding: 0;
        margin-top: -15px;
    
        svg{
            filter: $whiteFilter;
            width: 15px;
            height: 15px;
        }

        &:hover{
            cursor: pointer;
            opacity: .6;
        }
    }
 </style>