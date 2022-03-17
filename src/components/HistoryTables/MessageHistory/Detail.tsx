import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import {
  useChainHeadSubscription,
  MessageConfirmed
} from '../../../generated/graphql'
import Box from '../../Box'
import { IconClock } from '../../Icons'
import { AddressLink } from '../../AddressLink'
import { P } from '../../Typography'
import { Badge } from '../generic'
import {
  Head,
  DetailCaption,
  Line,
  Status,
  Confirmations,
  Parameters
} from '../detail'
import {
  attoFilToFil,
  getTotalCost,
  getGasPercentage,
  formatNumber
} from '../utils'
import { useMessage } from '../useAllMessages'
import { useUnformattedDateTime } from './useAge'
import { useMethodName } from './useMethodName'
import Card from '../../Card'

// add RelativeTime plugin to Day.js
dayjs.extend(relativeTime.default)

const SeeMore = styled(P).attrs(() => ({
  color: 'core.primary',
  role: 'button'
}))`
  cursor: pointer;
`

export default function MessageDetail(props: MessageDetailProps) {
  const { cid, height, speedUp, cancel, confirmations } = props
  const time = useMemo(() => Date.now(), [])
  const [seeMore, setSeeMore] = useState(false)
  const { message, error, loading, pending } = useMessage(cid, height)

  const chainHeadSubscription = useChainHeadSubscription({
    variables: {},
    shouldResubscribe: true,
    skip: pending
  })

  const value = useMemo(
    () => (message?.value ? attoFilToFil(message.value) : ''),
    [message?.value]
  )
  const totalCost = useMemo(
    () => (message ? getTotalCost(message, pending) : ''),
    [message, pending]
  )
  const gasPercentage = useMemo(
    () => (message ? getGasPercentage(message, pending) : ''),
    [message, pending]
  )
  const unformattedTime = useUnformattedDateTime(message, time)

  const confirmationCount = useMemo(
    () =>
      chainHeadSubscription.data?.chainHead.height && !!message?.height
        ? chainHeadSubscription.data.chainHead.height - message.height
        : 0,
    [message?.height, chainHeadSubscription.data?.chainHead.height]
  )

  const { methodName, actorName } = useMethodName(
    !!message
      ? {
          ...message,
          actorName: 'actorName' in message ? message.actorName : ''
        }
      : null
  )

  return (
    <Box>
      <Head
        title='Message Overview'
        pending={pending}
        speedUp={speedUp}
        cancel={cancel}
      />
      <hr />
      <DetailCaption
        name='Message Overview'
        captian='Scanning Filecoin for your message... This could take a minute.'
        loading={loading}
        error={error}
      />
      {!loading && !error && !!message && (
        <>
          <Line label='CID'>{cid}</Line>
          <Line label='Status and Confirmations'>
            <Status
              exitCode={(message as MessageConfirmed)?.exitCode}
              pending={pending}
            />
            {!pending && (
              <Confirmations count={confirmationCount} total={confirmations} />
            )}
          </Line>
          <Line label='Height'>{pending ? 'Pending' : message.height}</Line>
          <Line label='Timestamp'>
            {pending ? (
              'Pending'
            ) : (
              <>
                <IconClock width='1.125em' />
                {unformattedTime
                  ? `${unformattedTime?.from(
                      time
                    )} (${unformattedTime?.toString()})`
                  : ''}
              </>
            )}
          </Line>
          <hr />
          <Line label='From'>
            <AddressLink
              id={message.from.id}
              address={message.from.robust}
              hideCopyText={false}
            />
          </Line>
          <Line label='To'>
            <AddressLink
              id={message.to.id}
              address={message.to.robust}
              hideCopyText={false}
            />
          </Line>
          <hr />
          <Line label='Value'>{value}</Line>
          <Line label='Transaction Fee'>{pending ? 'Pending' : totalCost}</Line>
          {!loading && methodName && (
            <Line label='Method'>
              <Badge color='purple' text={methodName} />
            </Line>
          )}
          <hr />
          <SeeMore onClick={() => setSeeMore(!seeMore)}>
            Click to see {seeMore ? 'less ↑' : 'more ↓'}
          </SeeMore>
          <hr />
          {seeMore && (
            <>
              <Line label='Gas Limit & Usage by Txn'>
                {formatNumber(message.gasLimit)}
                <span className='gray'>|</span>
                {pending ? (
                  '?'
                ) : (
                  <>
                    {`${formatNumber((message as MessageConfirmed).gasUsed)}
                    attoFil`}
                    <span>({gasPercentage})</span>
                  </>
                )}
              </Line>
              <Line label='Gas Fees'>
                <span className='gray'>Premium</span>
                {formatNumber(message.gasPremium)} attoFIL
              </Line>
              <Line label=''>
                <span className='gray'>Fee Cap</span>
                {formatNumber(message.gasFeeCap)} attoFIL
              </Line>
              {!pending && (
                <>
                  <Line label=''>
                    <span className='gray'>Base</span>
                    {formatNumber(
                      (message as MessageConfirmed).baseFeeBurn
                    )}{' '}
                    attoFIL
                  </Line>
                  <Line label='Gas Burnt'>
                    {formatNumber((message as MessageConfirmed).gasBurned)}{' '}
                    attoFIL
                  </Line>
                </>
              )}
              <hr />
              <Parameters
                params={{ params: message.params }}
                actorName={actorName}
                depth={0}
              />
            </>
          )}
        </>
      )}
      {!loading && !error && !message && (
        <Card width='100%' bg='background.screen' border={0}>
          <P color='core.darkgray'>
            Message {cid} not found.
            <br />
            <br />
            Note - it may take 1-2 minutes for a recently confirmed message to
            show up here.
          </P>
        </Card>
      )}
    </Box>
  )
}

type MessageDetailProps = {
  cid: string
  height?: number
  speedUp?: () => void
  cancel?: () => void
  confirmations: number
}

MessageDetail.propTypes = {
  cid: PropTypes.string.isRequired,
  height: PropTypes.number,
  speedUp: PropTypes.func,
  cancel: PropTypes.func,
  confirmations: PropTypes.number
}

MessageDetail.defaultProps = {
  confirmations: 50
}
