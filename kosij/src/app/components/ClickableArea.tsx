import { cn } from "@/lib/utils/cn.util"
import { Button, GetProps } from "antd"
import { forwardRef } from "react"

type RefType = HTMLButtonElement | null
type Props = {
   reset?: boolean
} & GetProps<typeof Button>

const ClickableArea = forwardRef<RefType, Props>(function ClickableAreaComponent(props, ref) {
   const { className, ...propsRest } = props

   return (
      <Button
         ref={ref}
         className={cn("h-auto p-0 text-left", props.reset && "w-full rounded-none border-none shadow-none", className)}
         {...propsRest}
      >
         {props?.children}
      </Button>
   )
})

export default ClickableArea
