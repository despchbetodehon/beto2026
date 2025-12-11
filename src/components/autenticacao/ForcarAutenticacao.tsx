import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AutenticacaoContext from '@/data/contexts/AutenticacaoContext'
import Carregando from '../template/Carregando'

interface ForcarAutenticacaoProps {
    children: any
}

export default function ForcarAutenticacao(props: ForcarAutenticacaoProps) {
    const router = useRouter()
    const { usuario, carregando } = useContext(AutenticacaoContext)
    const [usuarioLocalStorage, setUsuarioLocalStorage] = useState<any>(null)

    // Verificar se há usuário salvo no localStorage (fallback se contexto falhar)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const usuarioSalvo = localStorage.getItem('usuarioAutenticado')
            if (usuarioSalvo) {
                try {
                    setUsuarioLocalStorage(JSON.parse(usuarioSalvo))
                } catch (e) {
                    console.error('Erro ao carregar usuário do localStorage:', e)
                }
            }
        }
    }, [])

    if (carregando) {
        return <Carregando />
    } else if (usuario?.email || usuarioLocalStorage?.email) {
        return props.children
    } else {
        router.push('/')
        return <Carregando />
    }
}