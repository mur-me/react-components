import React from 'react'
import styled, { css } from 'styled-components'

const Subscribe = styled.form`
  max-width: 670px;
  margin: 0 auto 25px auto;
`

const SubscribeInputWrapper = styled.div`
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
`

const SubscribeInput = styled.input`
  background: transparent;
  border: 0;
  width: 100%;
  padding: 0 0 15px 0;
  outline: 0;
  color: white;
`

const SubscribeSubmit = styled.button`
  background: transparent;
  border: 0;
  color: white;
  padding: 0 0 15px 0;
`

const SubscribeMessage = styled.div`
  ${props =>
    props.error &&
    css`
      padding-top: 10px;
      color: #ff4242;
    `}

  ${props =>
    props.success &&
    css`
      color: #1ad08f;
    `}
`

export default function FooterSubscribe() {
  return (
    <Subscribe>
      <SubscribeInputWrapper>
        <SubscribeInput
          type='email'
          placeholder='Leave your email to signup up to the newsletter'
        />
        <SubscribeSubmit>Subscribe</SubscribeSubmit>
      </SubscribeInputWrapper>

      <SubscribeMessage error>
        Something went wrong, please try again
      </SubscribeMessage>

      <SubscribeMessage success>Thanks for subscribing</SubscribeMessage>
    </Subscribe>
  )
}
