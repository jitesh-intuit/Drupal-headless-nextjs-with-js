import classNames from 'classnames';

export function PageHeader({ heading, text, className }) {
  return (
    <div className={classNames('container px-6 py-8 mx-auto', className)}>
      <div className="flex flex-col pb-4 space-y-2">
        <h1 className="text-5xl font-black leading-tight">{heading}</h1>
        {text && <p className="text-2xl font-light text-gray-600">{text}</p>}
      </div>
    </div>
  );
}
