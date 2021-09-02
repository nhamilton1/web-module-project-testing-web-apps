import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />)
});

test('renders the contact form header', ()=> {
    render(<ContactForm />)

    const header = screen.queryByText(/contact form/i)
    // could also do getByText, but dont want it to stop
    //before we get to the assertions

    expect(header).toBeInTheDocument()
    expect(header).toBeTruthy()
    expect(header).toHaveTextContent(/contact form/i)

});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />)
    // can use getByLabelText bec it has htmlFor and id connecting it

    const firstName = screen.getByLabelText(/first name*/i)
        userEvent.type(firstName, 'edd')

        //a state change happens here so we need to account for that
        // with a promise
     
    const oneError = await screen.findAllByTestId('error')
    expect(oneError).toHaveLength(1)
    

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)
    
    const button = screen.getByRole('button')
        userEvent.click(button)

        // we use queryAllByTestId bec there is more than one
    await waitFor(() => {
        const threeErrors = screen.queryAllByTestId('error')
        expect(threeErrors).toHaveLength(3)
    })


});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)

    const firstName = screen.getByLabelText(/first name*/i)
        userEvent.type(firstName, 'Winston')

    const lastName = screen.getByLabelText(/last name*/i)
        userEvent.type(lastName, 'Hamilton')

    const button = screen.getByRole('button')
        userEvent.click(button)

    
    const oneError = await screen.findAllByTestId('error')
        expect(oneError).toHaveLength(1)
   
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)

    const email = screen.getByLabelText(/email*/i)
        userEvent.type(email, 'invalidemail')

    
    const errorMsg = await screen.findByText(/email must be a valid email address./i)
        expect(errorMsg).toBeInTheDocument()
    

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)

    const firstName = screen.getByLabelText(/first name/i)
        userEvent.type(firstName, 'Winston')
    const email = screen.getByLabelText(/email/i)
        userEvent.type(email, 'invalidemail@validemail.com')

    const button = screen.getByRole('button')
        userEvent.click(button)

    const reqLastName = await screen.findByText(/lastName is a required field/i)
        expect(reqLastName).toBeInTheDocument()

});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)
    
    const firstName = screen.getByLabelText(/first name*/i)
        userEvent.type(firstName, 'Winston')
    const lastName = screen.getByLabelText(/last name*/i)
        userEvent.type(lastName, 'Hamilton')
    const email = screen.getByLabelText(/email*/i)
        userEvent.type(email, 'invalidemail@validemail.com')

    const button = screen.getByRole('button')
        userEvent.click(button)



    await waitFor(() => {
        const firstNameScreen = screen.queryByText('Winston')
        const lastNameScreen = screen.queryByText('Hamilton')
        const emailScreen = screen.queryByText('invalidemail@validemail.com')
        const messageDisplay = screen.queryByTestId('messageDisplay')

        expect(firstNameScreen).toBeInTheDocument()
        expect(lastNameScreen).toBeInTheDocument()
        expect(emailScreen).toBeInTheDocument()
        expect(messageDisplay).not.toBeInTheDocument()
    })

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />)
    
    const firstNameFeild = screen.getByLabelText(/first name*/i)
    const lastNameFeild = screen.getByLabelText(/last name*/i) 
    const emailFeild = screen.getByLabelText(/email*/i)  
    const messageFeild = screen.getByLabelText(/message/i)
        
        userEvent.type(firstNameFeild, 'Winston')
        userEvent.type(lastNameFeild, 'Hamilton')
        userEvent.type(emailFeild, 'validemail@gmail.com')
        userEvent.type(messageFeild, 'message')

    const button = await screen.findByRole('button')
        userEvent.click(button)



    await waitFor(() => {
        const firstNameDisplay = screen.queryByText('Winston')
        const lastNameDisplay = screen.queryByText('Hamilton')
        const emailDisplay = screen.queryByText('validemail@gmail.com')
        const messageDisplay = screen.queryByTestId(/message/i)

        expect(firstNameDisplay).toBeInTheDocument()
        expect(lastNameDisplay).toBeInTheDocument()
        expect(emailDisplay).toBeInTheDocument()
        expect(messageDisplay).toBeInTheDocument()
    })

});
