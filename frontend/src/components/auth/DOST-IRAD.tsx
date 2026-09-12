type DOSTLogoProps = {
  containerClassName?: string;
  imageClassName?: string;
};

const DOSTLogo = ({
  containerClassName = "flex items-center justify-center self-center font-medium -mt-40 -mb-20",
  imageClassName = "h-70 w-70 object-contain",
}: DOSTLogoProps) => {
  return (
    <div className={containerClassName}>
      <img src="/DOST.png" alt="DOST Logo" className={imageClassName} />
    </div>
  );
};

export default DOSTLogo;
