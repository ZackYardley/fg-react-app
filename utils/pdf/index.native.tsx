import ReactNativePdf, { PdfProps } from "react-native-pdf";

export default function Pdf(props: PdfProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ReactNativePdf {...props} />;
}
