import React from 'react'
import { getUserAvailability } from '@/actions/availability';
import AvailabilityForm from "./components/avalability-form"
import {defaultAvailability} from "./data"
const AvailabilityPage = async() => {
    const availability=await getUserAvailability()
  return <AvailabilityForm initialData={availability||defaultAvailability} />;
}

export default AvailabilityPage
