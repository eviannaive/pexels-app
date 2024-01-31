
"use client"

import { useSession, signOut } from 'next-auth/react';
	
export default function Dashboard() {
	const { data: session, status } = useSession();
	return (
		<div>
			collection<br/>
			{
				session? (
					<>
						<p>
							username: {session?.user.name}
						</p>
						<p>
							email: {session?.user.email}
						</p>
						<button onClick={()=>{
							signOut()
						}}>sign out</button>
					</>
				) : ''
			}
		</div>
	)
}
