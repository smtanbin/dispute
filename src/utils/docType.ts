
export default function docType(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
    
  switch (str) {
    case 'AT':
      return 'ATM';
        case 'EO':
      return 'EFT';
    case 'PT':
      return 'POS';
    case 'MB':
      return 'Mobile Bank';
    default:
      return str;
  }
}
