import {
  Html5QrcodeScanner,
  QrcodeErrorCallback,
  QrcodeSuccessCallback,
} from "html5-qrcode";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (
  props: Html5QrcodeScannerConfig
): Html5QrcodeScannerConfig => {
  let config: Html5QrcodeScannerConfig = { fps: props.fps ?? 10 };
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

type Html5QrcodePluginProps = Html5QrcodeScannerConfig & {
  verbose?: boolean;
  qrCodeSuccessCallback: QrcodeSuccessCallback;
  qrCodeErrorCallback?: QrcodeErrorCallback;
};

const Html5QrcodePlugin = (props: Html5QrcodePluginProps) => {
  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [props]);

  return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
