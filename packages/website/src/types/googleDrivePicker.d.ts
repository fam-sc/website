import type {
  DrivePickerDocsViewElement,
  DrivePickerDocsViewElementProps,
  DrivePickerElement,
  DrivePickerElementProps,
} from '@googleworkspace/drive-picker-element';

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'drive-picker': React.DetailedHTMLProps<
        React.HTMLAttributes<DrivePickerElement> & DrivePickerElementProps,
        DrivePickerElement
      >;
      'drive-picker-docs-view': React.DetailedHTMLProps<
        React.HTMLAttributes<DrivePickerDocsViewElement> &
          DrivePickerDocsViewElementProps,
        DrivePickerDocsViewElement
      >;
    }
  }
}
