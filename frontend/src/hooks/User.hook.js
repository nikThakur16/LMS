import { getUser, loginApi, logoutApi, registerApi, updateProfileApi } from "@/Api/user.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useRegisterHook = () => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: registerApi,
        onSuccess: (data) => {
            toast.success(data.message || 'Account created!')
            navigate('/')
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Registration failed')
        }
    })
}

export const useLoginHook = () => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            toast.success(data?.message || 'Welcome back!')
            // Redirect admin to dashboard, students to home
            if (data?.user?.admin) {
                navigate('/dashboard')
            } else {
                navigate('/')
            }
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Invalid email or password')
        }
    })
}

export const useGetUserHook = ()=>{
    return useQuery({
        queryFn:getUser,
        queryKey:['getUser'],
        retry:false
    })
}


export const useUpdateProfileHook = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateProfileApi,
        onSuccess: (data) => {
            toast.success(data?.message || 'Profile updated')
            queryClient.invalidateQueries({ queryKey: ['getUser'] })
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update profile')
        }
    })
}

export const useLoggedOut=()=>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn:logoutApi,
        onSuccess:(data)=>{
            toast.success(data?.message)
            navigate('/login')
        },
        onError:(err)=>{
            toast.error(err.response.data.message)
        }
    })
}