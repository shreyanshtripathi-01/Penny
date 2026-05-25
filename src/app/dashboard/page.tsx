import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '../DashboardClient'

export type Transaction = {
  id: string
  description: string
  amount: number
  category: string
  type: string
  date: string
}

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch initial transactions for the user
  const { data: dbTransactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  let initialTransactions: Transaction[] = []
  
  if (dbTransactions) {
    initialTransactions = dbTransactions.map(tx => ({
      id: tx.id,
      description: tx.description,
      amount: Number(tx.amount),
      category: tx.category,
      type: tx.type,
      date: tx.date
    }))
  }

  return (
    <DashboardClient 
      initialTransactions={initialTransactions} 
      userEmail={user.email || ''} 
      userName={user.user_metadata?.full_name || ''}
      userId={user.id} 
    />
  )
}
