export type ModalData = { type: string, props?: {} }

export type ModalId = number

export type ModalItem = ModalData & { id: ModalId }

export type Modals = ModalItem[]

export type ModalProviderContext = {
  addModal: (modalData: ModalData) => ModalId;
  closeModal: (modalId: ModalId) => ModalId;
  modals: Modals
}

export type ModalActions = Pick<ModalProviderContext, "addModal" | "closeModal">