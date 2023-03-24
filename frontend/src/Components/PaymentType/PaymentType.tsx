interface Props {
  name: string;
  children: any;
}

export default function PaymentType({ name, children }: Props) {
  return (
    <li>
      <input type="checkbox" name="credit" value="credit" id="credit" className="hidden peer" required />
      <label
        htmlFor="credit"
        className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-red-500 peer-checked:border-red-600 peer-checked:text-red-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="block">
          <div className="w-full text-lg font-semibold">{name}</div>
        </div>
        {children}
      </label>
    </li>
  );
}
