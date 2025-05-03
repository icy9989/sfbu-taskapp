"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import * as z from "zod"
import axios from "axios"
import toast from "react-hot-toast"
import { format } from "date-fns"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import useTeams from "@/hooks/use-teams"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
})

const TeamForm = ({ initialData = null }) => {
  const [loading, setLoading] = useState(false)
  const { mutate: mutateTeams } = useTeams();

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: ""
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (initialData) {
        await axios.put(`/api/teams/${initialData.id}`, data)
        toast.success("Team updated successfully.")
        mutateTeams()
      } else {
        await axios.post("/api/teams", data)
        toast.success("Team created successfully.")
        mutateTeams()
      }
      router.push("/teams");
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Team Name" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Team Job" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>Save Team</Button>
      </form>
    </Form>
  )
}

export default TeamForm
