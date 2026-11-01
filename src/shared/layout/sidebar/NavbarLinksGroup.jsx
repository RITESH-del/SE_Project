import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Box,
  Group,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import classes from './NavbarLinksGroup.module.css';

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened = false,
  links,
  link,
}) {
  const hasLinks = Array.isArray(links) && links.length > 0;
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isChildActive = hasLinks && links.some((l) => currentPath === l.link);
  const isControlActive = !hasLinks && Boolean(link) && currentPath === link;

  const [opened, setOpened] = useState(initiallyOpened);
  const isExpanded = opened || isChildActive;

  const handleControlClick = () => {
    if (hasLinks) {
      setOpened(!isExpanded);
    } else if (link) {
      navigate(link);
    }
  };

  const items = hasLinks
    ? links.map((item) => {
        const isActive = currentPath === item.link;
        return (
          <Link
            key={item.label}
            to={item.link}
            className={classes.link}
            data-active={isActive ? 'true' : undefined}
          >
            {item.label}
          </Link>
        );
      })
    : null;

  return (
    <>
      <UnstyledButton
        onClick={handleControlClick}
        className={classes.control}
        data-active={isControlActive ? 'true' : undefined}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            {Icon && (
              <ThemeIcon
                variant={isControlActive || isChildActive ? 'filled' : 'light'}
                color={isControlActive || isChildActive ? 'blue' : 'gray'}
                size={30}
              >
                <Icon size={18} />
              </ThemeIcon>
            )}

            <Box
              ml={Icon ? 'md' : 0}
              fw={isControlActive || isChildActive ? 600 : 500}
              c={isControlActive ? 'blue' : undefined}
            >
              {label}
            </Box>
          </Box>

          {hasLinks && (
            <ChevronRight
              className={classes.chevron}
              strokeWidth={1.5}
              size={16}
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>

      {hasLinks && isExpanded && (
        <div>
          {items}
        </div>
      )}
    </>
  );
}
