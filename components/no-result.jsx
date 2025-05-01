import Image from "next/image"

const NoResult = ({ text, width = 300, height = 300 }) => {
  return (
    <div className="w-full h-72 flex flex-col justify-center items-center">
        <div className="relative">
            <Image
                src={"/images/no-data.svg"}
                alt="404"
                width={width}
                height={height}
            />
        </div>
        <p className="mt-10 text-light text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export default NoResult