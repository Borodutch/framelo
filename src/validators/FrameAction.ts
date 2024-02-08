export default class FrameAction {
  untrustedData!: {
    url: string
    buttonIndex: number
  }
  trustedData!: {
    messageBytes: string
  }
}
