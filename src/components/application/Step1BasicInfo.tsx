import React from 'react';
import { useApplication } from '@/contexts/ApplicationContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Step1BasicInfo = () => {
  const { data, updateData } = useApplication();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Let's Get Started</h2>
        <p className="text-gray-600">
          Please provide your basic information so we can get in touch with you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
            placeholder="John"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            name="middleName"
            value={data.middleName}
            onChange={handleChange}
            placeholder="(Optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={data.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Preferred Contact Method *</Label>
          <p className="text-sm text-gray-500">How would you prefer we contact you?</p>
        </div>
        
        <RadioGroup
          value={data.preferredContact}
          onValueChange={(value) => updateData({ preferredContact: value as any })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="contact-email" />
            <Label htmlFor="contact-email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="contact-phone" />
            <Label htmlFor="contact-phone">Phone Call</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="contact-text" />
            <Label htmlFor="contact-text">Text Message</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bestTimeToCall">Best Time to Call</Label>
        <p className="text-sm text-gray-500">
          What's the best time for us to reach you?
        </p>
        <Select
          value={data.bestTimeToCall}
          onValueChange={(value) => updateData({ bestTimeToCall: value as any })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
            <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
            <SelectItem value="evening">Evening (5pm - 8pm)</SelectItem>
            <SelectItem value="anytime">Anytime</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
