// imports
import {
  chain,
  includes,
  isEmpty,
  find,
} from 'lodash';
import moment from 'moment';

// local imports
import { loadEvents } from '../../../event-store';
import {
  event_type,
  event_columns,
  invoice_status,
} from '../../../../model/consts';

export function formatDate(timestamp) {
  return moment(timestamp).format('DD-MM-YY')
}

export function buildInvoice(events) {
  const invoice_created = find(events, {
    type: event_type.invoice_created,
  });

  if (invoice_created) {
    const receipt_redeemed = find(events, {
      type: event_type.receipt_redeemed
    });
    const invoice_archived = find(events, {
      type: event_type.invoice_archived
    });
    const status = resolveStatus({
      invoice_created,
      invoice_archived,
      receipt_redeemed
    });
    const data = invoice_created.data;
    return {
      invoiceId: data.invoice_id,
      date: formatDate(invoice_created.timestamp),
      externalReferenceId: data.external_reference_id,
      btcAmount: data.btc_amount,
      status,
      fileIds: data.file_ids,
      contractBasePK: data.contract_base_pk,
      contractEncryptionKey: data.contract_encryption_key
    };
  }
  // TODO:: revisit, maybe option instead
  return null;
}

export function resolveStatus(invoiceMap) {
  if (invoiceMap.invoice_archived !== undefined) {
    return invoice_status.archived;
  } else if (invoiceMap.receipt_redeemed !== undefined) {
    return invoice_status.redeemed;
  } else {
    return invoice_status.pending;
  }
}

export default async (traderId, invoiceId) => loadEvents(traderId)
  .then(events => {
    const invoiceEvents = chain(events)
      .filter(event => event.data.invoice_id === invoiceId)
    return buildInvoice(invoiceEvents);
  });
