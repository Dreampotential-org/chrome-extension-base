<script lang="ts">
import { fieldTypes, setErrorResponses, createRequestObjectAndResetErrors } from './functions/authFunctions';
import axios from 'axios';

export let baseUrl:string = 'valueInChild';
export let currentScreen:string = 'valueInChild';
export let authenticated:boolean = false

  let disabled:boolean = true;
  let nonFieldError:string = "";
  let buttonText:string = "Sign in"

let loginFields: fieldTypes[] = [
   {
      label: "Email address",
      value: "",
      name: "username",
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

const getFieldValue = (event: Event, index: number) : void => {
    let fieldValue = (event.target as HTMLInputElement).value;

    loginFields[index].value = fieldValue;
    loginFields[index].hasError = fieldValue === '';
    //console.log('Value:', loginFields.map(field => field.value));

    disabled = loginFields.filter(field => field.value === '').length > 0
}

const attemptLogin = () : void => {
    

    buttonText = "Signing you in..."
    nonFieldError = ""

    let requestItems = createRequestObjectAndResetErrors(loginFields);

    let requestObject = requestItems.requestObject;
    loginFields = requestItems.fields

    axios.post(`${baseUrl}/login`, requestObject).then(response => {
        buttonText = "Sign in";
        //console.log('User response:', response);
        localStorage.setItem('userToken', response.data.token)
        authenticated = true
    }).catch(error => {
        buttonText = "Sign in"
        let errorResponse = error.response.data;
      //  console.log('Request error:', errorResponse)

        if (errorResponse.non_field_errors) {
            nonFieldError = errorResponse.non_field_errors[0]

            setTimeout(() => {
                nonFieldError = ""
            }, 6000)
        } else {
            loginFields = setErrorResponses(errorResponse, loginFields)
        }
      
    })
    
}

const switchScreen = ():void => {
    currentScreen = "register"
}
</script>

<main>
    <div class="auth-modal">
        <div class="header">Sign in to use this extension</div>
      {#each loginFields as field, index}
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
        <button disabled={disabled} on:click={() => attemptLogin()}>{ buttonText }</button>
      </div>

      <div class="signup-section">Don't have an account ? <b class="signup-link" on:click={() => switchScreen()}>Sign Up</b></div>
    </div>
</main>


<style lang="scss">
    @import "./css/auth.scss";

    .signup-section{
        font-size: .75rem;
        margin-top: .6rem;
        text-align: center;
    
        .signup-link{
            color: $colorMain;
            transition: ease-in-out .2s;
            &:hover{
                opacity: .6;
                cursor: pointer;
            }  
        }
    }
 </style>