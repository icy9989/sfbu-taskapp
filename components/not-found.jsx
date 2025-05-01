import Image from "next/image"

const NotFound = ({ text }) => {
  return (
    <div className="w-full h-[400px] flex flex-col justify-center items-center">
        <div className="relative">
            <Image
                src={"/images/404.svg"}
                alt="404"
                width={300}
                height={300}
            />
        </div>
        <p className="mt-10 text-light text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export default NotFound