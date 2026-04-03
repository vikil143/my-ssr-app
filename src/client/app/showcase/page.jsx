import React, { useState } from 'react';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import Checkbox from '../../components/Checkbox.jsx';
import FeatureItem from '../../components/FeatureItem.jsx';
import RadioGroup from '../../components/RadioGroup.jsx';
import SectionHeader from '../../components/SectionHeader.jsx';
import Select from '../../components/Select.jsx';
import StatCard from '../../components/StatCard.jsx';
import TextArea from '../../components/TextArea.jsx';
import TextInput from '../../components/TextInput.jsx';

export default function ShowcasePage() {
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [plan, setPlan] = useState('starter');
  const [role, setRole] = useState('developer');
  const [agreed, setAgreed] = useState(true);
  const [updates, setUpdates] = useState(false);

  return (
    <section className="space-y-8">
      <SectionHeader
        badge="Showcase"
        title="Custom Tailwind components in one page"
        description="This route renders the shared UI building blocks together so you can inspect the theme behavior, spacing, and component styling in one place."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Components"
          value="11"
          detail="Reusable UI primitives and composites currently available in the client layer."
          tone="cyan"
        />
        <StatCard
          label="Themes"
          value="2"
          detail="Every showcased component responds to the shared light and dark theme system."
          tone="emerald"
        />
        <StatCard
          label="Route"
          value="/showcase"
          detail="Use this page as a quick visual check while adjusting the design system."
          tone="fuchsia"
        />
      </div>

      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Badges
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge tone="cyan">Cyan</Badge>
            <Badge tone="emerald">Emerald</Badge>
            <Badge tone="fuchsia">Fuchsia</Badge>
            <Badge tone="rose">Rose</Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Form Controls
            </p>
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
              Input, select, textarea, checkbox, radio, and button
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Project name"
            />
            <Select value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="starter">Starter Plan</option>
              <option value="team">Team Plan</option>
              <option value="enterprise">Enterprise Plan</option>
            </Select>
          </div>
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add project notes"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <RadioGroup
              label="Role"
              name="role"
              value={role}
              onChange={setRole}
              options={[
                {
                  value: 'developer',
                  label: 'Developer',
                  description: 'Focused on implementation and integration work.'
                },
                {
                  value: 'designer',
                  label: 'Designer',
                  description: 'Focused on interface polish and component presentation.'
                }
              ]}
            />
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Preferences
              </p>
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                label="Accept component defaults"
                hint="Uses the library spacing, border radius, and color treatment."
              />
              <Checkbox
                checked={updates}
                onChange={(e) => setUpdates(e.target.checked)}
                label="Send UI updates"
                hint="Example secondary checkbox state for settings forms."
              />
            </div>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => {
            setValue('Tailwind Form Kit');
            setPlan('team');
            setRole('designer');
            setAgreed(true);
            setUpdates(true);
            setNotes('Reusable form components with consistent light and dark theme styling.');
          }}>
            Fill Demo
          </Button>
          <div className="grid gap-3 sm:grid-cols-2">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Project: <span className="font-semibold">{value || 'Empty'}</span>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Plan: <span className="font-semibold capitalize">{plan}</span>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Role: <span className="font-semibold capitalize">{role}</span>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Updates: <span className="font-semibold">{updates ? 'Enabled' : 'Disabled'}</span>
            </p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Notes: <span className="font-semibold">{notes || 'Empty'}</span>
          </p>
        </Card>

        <Card className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Card
            </p>
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
              Reusable content surface
            </h3>
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            The card component standardizes padding, rounded corners, background treatment,
            and border styling for both light and dark themes.
          </p>
          <Button className="w-full sm:w-auto">Primary Action</Button>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Section Header
            </p>
            <SectionHeader
              badge="Pattern"
              tone="emerald"
              title="Reusable title block"
              description="This composite component wraps the common heading pattern used across pages, with an optional badge and supporting copy."
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Feature Items
            </p>
          </div>
          <div className="space-y-4">
            <FeatureItem
              title="Consistent rhythm"
              description="Feature items create a simple, reusable presentation for short product or UI notes."
            />
            <FeatureItem
              title="Light and dark aware"
              description="The marker and text styling adapt automatically to the active theme."
            />
            <FeatureItem
              title="Composable"
              description="Use these inside cards, sections, or marketing-style layouts without repeating utility blocks."
            />
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Composition
          </p>
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
            Mixed component layout
          </h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="p-4">
            <Badge tone="emerald">Status</Badge>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Building blocks can be nested to assemble richer feature sections.
            </p>
          </Card>
          <Card className="p-4">
            <Badge tone="fuchsia">Theme</Badge>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Toggle the theme in the header to inspect both variants on the same page.
            </p>
          </Card>
          <Card className="p-4">
            <Badge tone="rose">Reuse</Badge>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              These components now back the existing routes instead of duplicated classes.
            </p>
          </Card>
        </div>
      </Card>
    </section>
  );
}
