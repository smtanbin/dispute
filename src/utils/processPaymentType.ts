
export default function processPaymentType(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
  
  const firstChar = str.charAt(0).toUpperCase();
  
  switch (firstChar) {
    case 'D':
      return 'Debit';
        case 'Y':
      return 'Debited';
    case 'C':
      return 'Credit';
    case 'R':
      return 'Reverse';
    default:
      return str;
  }
}
