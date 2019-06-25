import * as React from 'react';
import styled from 'styled-components';
import { isDefined } from '@utils/utils';
import { idToLabel } from '@utils/conversions';
import { Color, theme } from '@utils/color';
import { isEmpty } from 'fp-ts/lib/Array';
import { none, Option, some } from 'fp-ts/lib/Option';

const DOWN_ARROW = 40;
const UP_ARROW = 38;

export interface DropdownOption {
  id: string;
  value: string;
}

interface Props {
  id: string;
  label?: string;
  options: DropdownOption[];
  selected: DropdownOption | null;
  onSelect: (option: DropdownOption) => void;
}

interface State {
  open: boolean;
  hoverIndex: Option<number>;
}

const Wrapper = styled.div`
  color: ${theme.text.medium.hex};
  display: flex;
  flex-direction: column-reverse;
  position: relative;
`;

const StyledLabel = styled.label`
  font-size: .9em;
  padding-bottom: .5em;
  transition: color 300ms ease;
`;

interface DropdownSelectorProps {
  hasValue: boolean;
}

const DropdownSelector = styled.button<DropdownSelectorProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
  background-color: #f5f8f8;
  padding: 1em;
  border-radius: .3em;
  width: 100%;
  outline: none;
  border: 0;
  text-align: left;
  transition: background-color 300ms ease;
  cursor: pointer;
  color: ${props => props.hasValue ? Color.shade(100).hex : theme.text.light.hex};
  &:focus + label {
    color: ${theme.text.medium.darken(.2)};
  }
  &:focus {
    background-color: ${theme.secondary.toRgba(.3)};
  }
`;

interface OptionsProps {
  shouldDisplay: boolean;
}

const Options = styled.ul<OptionsProps>`
  background-color: ${Color.shade(0).hex};
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  color: ${theme.text.medium.hex};
  margin: 0;
  padding: .2em;
  list-style-type: none;
  border-radius: .3em;
  position: absolute;
  top: 100%;
  width: 100%;
  transition: opacity 200ms ease;
  opacity: ${props => props.shouldDisplay ? '1' : '0'};
  visibility: ${props => props.shouldDisplay ? undefined : 'hidden'};
  max-height: 15em;
  z-index: 1000;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
    border-radius: 1em;
  }
`;

interface OptionProps {
  hovered: boolean;
}

const Option = styled.li<OptionProps>`
  padding: 1em;
  cursor: pointer;
  border-radius: .3em;
  background-color: ${props => props.hovered ? theme.interactions.hover.hex : undefined};
`;

const Icon = styled.i`
  font-size: 1em;
  color: ${theme.text.medium.hex};
`;

export default class Dropdown extends React.Component<Props, State> {

  state: State = { open: false, hoverIndex: none };
  selectedRef: React.RefObject<HTMLLIElement> = React.createRef();
  optionsRef: React.RefObject<HTMLUListElement> = React.createRef();

  placeholder = (label: string) => (
    isDefined(this.props.selected) ? this.props.selected.value : label
  )

  toggleAndSelect = () => {
    if (this.state.open) {
      this.selectOptionAndBlur();
      return;
    }
    this.setState({ open: true });
  }

  clearHover = () => {
    if (this.state.hoverIndex.getOrElse(-1) >= 0) {
      this.setState({ hoverIndex: none });
    }
  }

  dropdownOptions = () => (
    <Options
      shouldDisplay={this.state.open}
      onMouseLeave={this.clearHover}
      ref={this.optionsRef}
    >
      {this.props.options.map(this.dropdownOption)}
    </Options>
  )

  selectOptionAndBlur = () => {
    this.selectOption();
    this.setState({ open: false, hoverIndex: none });
  }

  selectOption = () => {
    const hoveredOption = this.props.options[this.state.hoverIndex.getOrElse(-1)];
    if (isDefined(hoveredOption) && hoveredOption.id !== this.props.selected!.id) {
      this.props.onSelect(hoveredOption);
    }
  }

  dropdownOption = (option: DropdownOption, index: number) => (
    <Option
      ref={index === this.state.hoverIndex.getOrElse(-1) ? this.selectedRef : undefined}
      key={option.id}
      id={option.id}
      value={option.id}
      hovered={index === this.state.hoverIndex.getOrElse(-1)}
      onMouseDown={this.selectOption}
      onMouseEnter={() => this.setState({ hoverIndex: some(index) })}
    >
      {option.value}
    </Option>
  )

  scrollNext = () => {
    const viewTop = this.optionsRef.current!.scrollTop;
    const viewBottom = viewTop + this.optionsRef.current!.clientHeight;
    const optTop = this.selectedRef.current!.offsetTop;
    const optBottom = optTop + this.selectedRef.current!.clientHeight;
    if (optTop < viewTop) {
      this.optionsRef.current!.scrollTop = viewTop - (viewTop - optTop);
    } else if (optBottom > viewBottom) {
      this.optionsRef.current!.scrollTop = viewTop + (optBottom - viewBottom);
    }
  }

  nextHover = (charCode: number) => {
    if (isEmpty(this.props.options)) { return null; }
    switch (charCode) {
      case UP_ARROW:
        const upIndex = this.state.hoverIndex.getOrElse(0);
        return (this.props.options.length + upIndex - 1) % this.props.options.length;
      case DOWN_ARROW:
        const downIndex = this.state.hoverIndex.getOrElse(this.props.options.length - 1);
        return (downIndex! + 1) % this.props.options.length;
      default: return null;
    }
  }

  hoverNextOption = (e: React.KeyboardEvent) => {
    const nextIndex = this.nextHover(e.keyCode);
    if (isDefined(nextIndex)) {
      e.preventDefault();
      this.setState(
        { hoverIndex: some(nextIndex) },
        this.scrollNext
      );
    }
  }

  render() {
    const label = isDefined(this.props.label) ? this.props.label : idToLabel(this.props.id);
    return (
      <Wrapper>
        {this.dropdownOptions()}
        <DropdownSelector
          id={this.props.id}
          onClick={this.toggleAndSelect}
          onBlur={() => this.setState({open: false, hoverIndex: none})}
          onKeyDown={this.hoverNextOption}
          hasValue={isDefined(this.props.selected)}
          onMouseEnter={this.clearHover}
        >
          <span>{this.placeholder(label)}</span>
          <Icon className="material-icons">expand_more</Icon>
        </DropdownSelector>
        <StyledLabel htmlFor={this.props.id}>{label}</StyledLabel>
      </Wrapper>
    );
  }
}
