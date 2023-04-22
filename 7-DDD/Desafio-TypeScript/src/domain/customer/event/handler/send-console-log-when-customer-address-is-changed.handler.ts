import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class SendConsoleLogWhenCustomerAddressIsChangedHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    const customer = event.eventData;
    console.log(`Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.address.street}, ${customer.address.number}, ${customer.address.city} - ${customer.address.zip}`); 
  }
}
