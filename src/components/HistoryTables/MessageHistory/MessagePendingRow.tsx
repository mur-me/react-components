import React, { useMemo } from 'react'
import { FilecoinNumber } from '@glif/filecoin-number'
import Link from 'next/link'
import PropTypes from 'prop-types'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import { Badge } from '../generic'
import { TR, TD } from '../table'
import { AddressWOptionalLink } from '../../Link/SmartLink'
import { MessagePendingRow, MESSAGE_PENDING_ROW_PROP_TYPE } from '../types'
import { useMethodName } from './useMethodName'
import convertAddrToPrefix from '../../../utils/convertAddrToPrefix'

// add RelativeTime plugin to Day.js
dayjs.extend(relativeTime.default)

export default function PendingMessageHistoryRow(
  props: PendingMessageHistoryRowProps
) {
  const { message, cidHref, addressHref, inspectingAddress } = props
  const incoming = useMemo(
    () =>
      convertAddrToPrefix(message.to.robust) ===
        convertAddrToPrefix(inspectingAddress) ||
      convertAddrToPrefix(message.to.id) ===
        convertAddrToPrefix(inspectingAddress),
    [message.to, inspectingAddress]
  )
  const { methodName } = useMethodName({ ...message, actorName: '' })
  return (
    <TR>
      <TD>
        <Link href={cidHref(message.cid)}>
          <a
            style={{
              display: 'inline-block',
              maxWidth: '8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {message.cid.slice()}
          </a>
        </Link>
      </TD>
      {props.inspectingAddress && (
        <TD>
          <Badge color='purple'>{methodName.toUpperCase()}</Badge>
        </TD>
      )}
      <TD>(Pending)</TD>
      <TD>(Pending)</TD>
      <TD>
        <AddressWOptionalLink
          address={message.from.robust}
          addressHref={addressHref}
          inspectingAddress={inspectingAddress}
        />
      </TD>
      <TD>
        <Badge color={incoming ? 'green' : 'yellow'}>
          {incoming ? 'IN' : 'OUT'}
        </Badge>
      </TD>
      <TD>
        <AddressWOptionalLink
          address={message.to.robust}
          addressHref={addressHref}
          inspectingAddress={inspectingAddress}
        />
      </TD>
      <TD>{new FilecoinNumber(message.value, 'attofil').toFil()} FIL</TD>
    </TR>
  )
}

type PendingMessageHistoryRowProps = {
  message: MessagePendingRow
  cidHref: (cid: string, height?: string) => string
  addressHref: (address: string) => string
  inspectingAddress: string
}

PendingMessageHistoryRow.propTypes = {
  message: MESSAGE_PENDING_ROW_PROP_TYPE.isRequired,
  cidHref: PropTypes.func.isRequired,
  addressHref: PropTypes.func.isRequired,
  inspectingAddress: PropTypes.string
}

PendingMessageHistoryRow.defaultProps = {
  inspectingAddress: ''
}
