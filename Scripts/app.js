"use strict";

// IIFE - Immediate invoked functional expression
(function (){

    function CheckLogin () {

        if(sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fa-solid fa-undo"></i> Logout</a>`);
        }

        $("#logout").on("click", function () {

            sessionStorage.clear();
            location.href = "index.html";

        });
    }

    function LoadHeader(html_data){

        $("header").html(html_data);
        $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
        CheckLogin();
    }

    function AjaxRequest(method, url, callback){

        let xhr = new XMLHttpRequest();

        //Step 2: Opens a connection to the server
        xhr.open(method, url);

        xhr.addEventListener("readystatechange", ()=> {

            if(xhr.readyState === 4 && xhr.status === 200){

                if(typeof callback == "function") {
                    callback(xhr.responseText);
                }else{
                    console.error("Error.  Callback not a function")
                }
            }
        });
        //Step 3: Send the Request
        xhr.send();
    }

    function contactFormValidation() {
        // Full name
        ValidateField("#fullName",
            /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,
            "Please enter a valid First and Last name!")

        // Contact number
        ValidateField("#contactNumber",
            /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "Please enter a valid Contact number!")

        // Email address
        ValidateField("#emailAddress",
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "Please enter a valid Email address!")
    }

    /**
     * this function validates input for the contact and edit pages.
     * @param input_field_id
     * @param regular_expression
     * @param error_message
     */

    function ValidateField(input_field_id, regular_expression, error_message){
        let messageArea = $("#messageArea").hide();

        $(input_field_id).on("blur", function () {
            let input_value = $(this).val();
            if(!regular_expression.test(input_value)){
                // fail validation
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }else{
                //pass validation
                messageArea.removeClass("class").hide();
            }
        });
    }

    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize()){
            let key = contact.fullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }



    function DisplayHomePage(){
        console.log("called DisplayHomePage");

        $("#AboutUsBtn").on("click", () =>{
            location.href = "about.html";
        });

        $("min").append(`<p id ="MainParagraph" 
                                class="mt-3"> This is my first paragraph</p>`);

        $("body").append(`<article class="container">
                       <p id="ArticleParagraph" class="mt-3"> This is my article paragraph</p></article>`)

        let DocumentBody = document.body;

        let Article = document.createElement("article");
        let ArticleParagraph = `<p id="ArticleParagraph"> This is my article paragraph</p>`;
        Article.setAttribute("class", "container");
        Article.innerHTML = ArticleParagraph;

        DocumentBody.appendChild(Article);
    }

    function DisplayProductPage(){
        console.log("called DisplayProductPage");
    }

    function DisplayAboutUsPage(){
        console.log("called DisplayAboutUsPage");
    }

    function DisplayContactsPage(){
        console.log("called DisplayContactsPage");

        //TestFullName();
        contactFormValidation();

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function (){

            if(subscribeCheckbox.checked){

                AddContact(fullName, contactNumber, emailAddress);
            }

        });
    }

    function DisplayServicesPage(){
        console.log("called DisplayServicesPage...");
    }

    function DisplayLoginPage(){
        console.log("called DisplayLoginPage...");

        let messageArea = $("#messageArea");

        $("#loginButton").on("click", function () {

            let success = false;
            let newUser = new core.User();

            $.get("./Data/users.json", function(data) {

                for(const user of data.users) {

                    console.log(user);
                    if(username.value === user.Username && password.value === user.Password) {

                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                if(success){
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    location.href = "contact-list.html";
                }else{
                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Credentials")
                        .show();
                }
            });
        });

        $("#cancelButton").on("click", function () {

            document.forms[0].reset();
            location.href = "index.html";

        });

    }

    function DisplayRegisterPage(){
        console.log("called DisplayRegisterPage...");
    }

    function DisplayContactListPage(){
        console.log("called DisplayContactListPage");

        if(localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";

            let index = 1;
            let keys = Object.keys(localStorage);

            for(const key of keys) {
                let contact = new core.Contact();
                let contactData = localStorage.getItem(key);

                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th>
                        <td>${contact.fullName}</td>
                        <td>${contact.contactNumber}</td>
                        <td>${contact.emailAddress}</td>
                        <td>
                            <button value="${key}" class="btn btn-primary btn-sm edit">
                                <i class="fas fa-edit fa-sm"> Edit</i>
                            </button>
                        </td>
                        <td>
                            <button value="${key}" class="btn btn-danger btn-sm delete">
                                <i class="fas fa-trash-alt fa-sm"> Delete</i>
                            </button>
                        </td>
                        </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }
        $("#addButton").on("click", () => {
            location.href = "edit.html#add";
        });

        $("button.edit").on("click", function () {
            location.href = "edit.html#" + $(this).val();
        });

        $("button.delete").on("click", function () {
            if(confirm("Confirm contact delete?")) {
                localStorage.removeItem($(this).val());
            }

            location.href = "contact-list.html";
        });
    }

    function DisplayEditPage(){
        console.log("called DisplayEditPage...");

        contactFormValidation();

        let page = location.hash.substring(1);
        switch (page) {
            case "add":

                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fa fa-plus fa-sm"> Add`);
                $("#editButton").on("click", (event) => {
                    // prevent form submission
                    event.preventDefault();

                    AddContact(fullName.value, contactNumber.value, emailAddress.value);

                    location.href = "contact-list.html";
                });

                $("#cancelButton").on("click", () => {
                    location.href = "contact-list.html";
                });

                break;
            default:
                // Edit operation
                let contact = new core.Contact();

                contact.deserialize(localStorage.getItem(page));

                $("#fullName").val(contact.fullName);
                $("#contactNumber").val(contact.contactNumber);
                $("#emailAddress").val(contact.emailAddress);

                $("#editButton").on("click", (event) => {

                    //prevent form submission
                    event.preventDefault();
                    contact.fullName = $("#fullName").val();
                    contact.contactNumber = $("#contactNumber").val();
                    contact.emailAddress = $("#emailAddress").val();


                    localStorage.setItem(page, contact.serialize());
                    location.href = "contact-list.html";

                });

                $("#cancelButton").on("click", () => {
                    location.href = "contact-list.html";
                });

                break;
        }
    }

    function Start (){
        console.log("App started...");

        AjaxRequest("GET", "header.html", LoadHeader);

        switch(document.title){

            case "Home":
                DisplayHomePage();
                break;
            case "Products":
                DisplayProductPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Contacts":
                DisplayContactsPage();
                break;
            case "About Us":
                DisplayAboutUsPage();
                break;
            case "Contact-List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
        }
    }

    window.addEventListener("load", Start);

})()