import { useState } from 'react';
import {
  ChevronRight,
} from 'lucide-react';

import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';

import classes from './NavbarLinksGroup.module.css';

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened = false,
  links,
}) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened);

  const items = hasLinks
    ? links.map((link) => (
        <Text
          component="a"
          className={classes.link}
          href={link.link}
          key={link.label}
          onClick={(event) => event.preventDefault()}
        >
          {link.label}
        </Text>
      ))
    : null;

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((current) => !current)}
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>

            <Box ml="md">
              {label}
            </Box>
          </Box>

          {hasLinks && (
            <ChevronRight
              className={classes.chevron}
              strokeWidth={1.5}
              size={16}
              style={{
                transform: opened ? 'rotate(90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>

      {/* {hasLinks && (
        <Collapse in={opened}>
          {items}
        </Collapse>
      )} */}

      {hasLinks && opened && (
  <div>
    {items}
  </div>
)}
    </>
  );
}