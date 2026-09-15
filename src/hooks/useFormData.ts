import { useState, type ChangeEvent } from "react"

export const useFormData = (initialValue:string)=>{

    const[value,setValue] = useState<string>(initialValue)
    const[error,setError] = useState<string>('')

    const handleValueChange = (e:ChangeEvent<HTMLFormElement>)=>{
        if(!value){
            setError(()=>'Please enter a value')
        }else{
            setValue(()=>e.target.value)
        }
    }
    return {value,handleValueChange,error} as const;
}
